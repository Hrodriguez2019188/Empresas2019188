import bcryptjs from 'bcryptjs';
import Business from './business.model.js';
import exceljs from 'exceljs';

// Método POST
export const businessPost = async (req, res) => {
  const { name, impactLevel, experience, category } = req.body;
  const business = new Business({
    name,
    impactLevel,
    experience,
    category,
  
  });

  await business.save();
  res.status(200).json({ business });
};

// Método GET
export const businessGet = async (req, res) => {
  const { limit, from } = req.query;
  const query = { estado: true };

  const [total, businesses] = await Promise.all([
    Business.countDocuments(query),
    Business.find(query).skip(Number(from)).limit(Number(limit)),
  ]);
  res.status(200).json({ total, businesses });
};

// Método para generar un reporte Excel de todos los negocios registrados
export const businessExcel = async (req, res) => {
  try {
    const businesses = await Business.find();
    const excelWork = new exceljs.Workbook();
    const excelSheet = excelWork.addWorksheet('Negocios');

    // Añadir filas según los parámetros del negocio
    excelSheet.addRow([
      'Nombre',
      'Nivel de Impacto',
      'Tiempo de Operación',
      'Categoría',
      'Tamaño',
    ]);

    // Añadir los datos de cada negocio a las filas creadas
    businesses.forEach((businessRow) => {
      excelSheet.addRow([
        businessRow.name,
        businessRow.impactLevel,
        businessRow.experience,
        businessRow.category,
      
      ]);
    });

    // Encabezado de tipo de contenido
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Encabezado de nombre de archivo
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Reporte.xlsx"'
    );

    await excelWork.xlsx.write(res);

    res.end();
  } catch (e) {
    console.log('Error inesperado ocurrido al generar un reporte:', e);
    return res.status(500).json({
      e: 'Error inesperado',
    });
  }
};

// Método PUT
export const businessPut = async (req, res) => {
  const { id } = req.params;
  const { _id, estado, ...rest } = req.body;

  if (rest.password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(rest.password, salt);
  }

  const business = await Business.findByIdAndUpdate(id, rest, { new: true });
  res.status(200).json({ business });
};

// Ordenar negocios por nombre, categoría y tiempo de operación
export const businessOrder = async (req, res = Response) => {
  const { orderReference } = req.params;

  let sorting, orderMode;

  switch (parseInt(orderReference)) {
    case 1:
      sorting = 'name';
      orderMode = 'asc';
      break;
    case 2:
      sorting = 'name';
      orderMode = 'desc';
      break;
    case 3:
      sorting = 'experience';
      orderMode = 'asc';
      break;
    case 4:
      sorting = 'category';
      orderMode = 'asc';
      break;
    default:
      sorting = 'name';
      orderMode = 'asc';
  }

  const businesses = await Business.find().sort({ [sorting]: orderMode });
  res.status(200).json({ businesses });
};
