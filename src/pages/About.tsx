import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto sce-content">
        <h1 className="text-3xl font-bold mb-6">О Фонде SCE</h1>
        
        <div className="sce-warning mb-8">
          <p>
            ВНИМАНИЕ: Информация на этой странице предназначена только для авторизованного персонала.
          </p>
        </div>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
          <p className="mb-4">
            SCE Foundation (Secure. Control. Explore.) - секретная организация, созданная для обеспечения 
            безопасности человечества путем задержания, контроля и исследования аномальных объектов, 
            сущностей и явлений, которые угрожают привычному порядку реальности.
          </p>
          <p>
            Наш девиз "Secure. Control. Explore." отражает три основных принципа работы Фонда:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Secure (Обезопасить)</strong> - защитить человечество от аномальных угроз</li>
            <li><strong>Control (Контролировать)</strong> - содержать и управлять аномалиями</li>
            <li><strong>Explore (Исследовать)</strong> - изучать аномалии для расширения знаний человечества</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">История организации</h2>
          <p className="mb-4">
            Фонд SCE был основан в [ДАННЫЕ УДАЛЕНЫ] после серии инцидентов [ДАННЫЕ УДАЛЕНЫ], 
            когда стало очевидно, что миру необходима организация, способная противостоять аномальным угрозам.
          </p>
          <p>
            За годы своего существования Фонд SCE создал сеть объектов по всему миру, разработал 
            систему классификации аномалий и протоколы по их содержанию, а также собрал обширный архив 
            исследований, документирующих сущность и характеристики различных аномалий.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Структура организации</h2>
          <p className="mb-4">
            Фонд SCE состоит из нескольких ключевых подразделений:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Отдел содержания</strong> - ответственен за безопасное содержание аномалий</li>
            <li><strong>Отдел исследований</strong> - занимается изучением природы аномалий</li>
            <li><strong>Оперативный отдел</strong> - отвечает за полевые операции и обнаружение аномалий</li>
            <li><strong>Отдел администрации</strong> - обеспечивает функционирование Фонда</li>
            <li><strong>Отдел классификации</strong> - определяет класс опасности и условия содержания</li>
            <li><strong>Служба безопасности</strong> - охраняет объекты и персонал Фонда</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Классификация объектов SCE</h2>
          <p className="mb-4">
            Для определения уровня опасности и процедур содержания аномалий используется следующая классификация:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 border border-border rounded-sm">
              <h3 className="font-bold mb-2 text-primary">SAFE</h3>
              <p>Объекты, которые могут быть надежно содержаны с помощью стандартных процедур и не представляют серьезной угрозы.</p>
            </div>
            <div className="bg-white p-4 border border-border rounded-sm">
              <h3 className="font-bold mb-2 text-yellow-600">EUCLID</h3>
              <p>Объекты, которые требуют специальных условий содержания и представляют умеренную угрозу.</p>
            </div>
            <div className="bg-white p-4 border border-border rounded-sm">
              <h3 className="font-bold mb-2 text-primary">KETER</h3>
              <p>Объекты, которые крайне сложно содержать и представляют серьезную угрозу для человечества.</p>
            </div>
            <div className="bg-white p-4 border border-border rounded-sm">
              <h3 className="font-bold mb-2 text-blue-600">THAUMIEL</h3>
              <p>Редкие объекты, которые используются Фондом для содержания или нейтрализации других опасных аномалий.</p>
            </div>
            <div className="bg-white p-4 border border-border rounded-sm">
              <h3 className="font-bold mb-2 text-gray-500">NEUTRALIZED</h3>
              <p>Объекты, которые больше не проявляют аномальных свойств или были полностью уничтожены.</p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Присоединение к Фонду SCE</h2>
          <p className="mb-4">
            Фонд SCE постоянно набирает персонал различных специальностей. Требуются исследователи, 
            агенты полевых операций, сотрудники службы безопасности, врачи, инженеры и административный персонал.
          </p>
          <p>
            Для рассмотрения вашей кандидатуры необходимо зарегистрироваться на сайте. Помните, что разглашение 
            информации о Фонде SCE и его деятельности строго запрещено и преследуется по закону.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default About;
